'use strict';

/**
 * @ngdoc function
 * @name rscineFrontendApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the rscineFrontendApp
 */
angular.module('rscineFrontendApp')

    // TODO : refactor en service maybe ?
    .config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider) {
         var nga = NgAdminConfigurationProvider;
         // create an admin application
         var admin = nga.application('Rscine Admin Panel')
           .baseApiUrl('http://dev.rscine.com/app_dev.php/api/');

         var user = nga.entity('users');

         var county = nga.entity('counties');

         var department = nga.entity('departments');

         var userViewFields = [
             nga.field('id'),
             nga.field('username').label('Nom d\'utilisateur'),
             nga.field('email').label('E-mail'),
             nga.field('department', 'reference')
                .targetEntity(department)
                .targetField(nga.field('name'))
         ];

         var userCreateFields = [
             nga.field('username').label('Nom d\'utilisateur'),
             nga.field('email', 'email').label('E-mail'),
             nga.field('firstPlainPassword', 'password').label('Mot de passe'),
             nga.field('secondPlainPassword', 'password').label('Confirmation du mot de passe')
         ];

         var userEditFields = [
             nga.field('username').label('Nom d\'utilisateur'),
             nga.field('email', 'email').label('E-mail')
         ];

         var userDeleteFields = [
             nga.field('username').label('Nom d\'utilisateur'),
             nga.field('email').label('E-mail')
         ];

         user.listView().fields(userViewFields);
         user.showView().fields(userViewFields);

         user.editionView().fields(userEditFields);

         user.deletionView().fields(userDeleteFields);

         user.creationView().fields(userCreateFields);

         county.listView().fields([
             nga.field('id'),
             nga.field('name')
         ]);

         department.listView().fields([
             nga.field('id'),
             nga.field('name'),
             nga.field('number')
         ]);

         department.showView().fields([
             nga.field('id'),
             nga.field('name'),
             nga.field('number')
         ]);

         department.editionView().fields([
             nga.field('name'),
             nga.field('number')
         ]);

         admin.addEntity(user);
         admin.addEntity(county);
         admin.addEntity(department);
         // more configuation here later
         // ...
         // attach the admin application to the DOM and run it
         nga.configure(admin);
    }])

    // TODO : refactor en service maybe ?
    .config(['RestangularProvider', function(RestangularProvider) {
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {

            if (what === 'users') {

                if(operation === 'patch' || operation === 'put') {
                    delete element.id; // On supprime l'id (qui n'est pas dans le formulaire de l'api)
                    element = { appbundle_user_edit: element };
                }

                if(operation === 'post') {
                    delete element.id; // On supprime l'id (qui n'est pas dans le formulaire de l'api)
                    element.plainPassword = {first: element.firstPlainPassword, second: element.secondPlainPassword};
                    delete element.firstPlainPassword;
                    delete element.secondPlainPassword;
                    element = { appbundle_user_register: element };
                }

            }

            if (what === 'departments') {
                if(operation === 'post') {
                    delete element.id; // On supprime l'id (qui n'est pas dans le formulaire de l'api)
                    element = { appbundle_department: element };
                }
            }

            return { element: element };
        });
    }])


    // TODO : refactor en service maybe ?
    .config(['RestangularProvider', function (RestangularProvider) {
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
            if (operation === "getList") {
                // custom pagination params
                if (params._page) {
                    params._start = (params._page - 1) * params._perPage;
                    params._end = params._page * params._perPage;
                }
                delete params._page;
                delete params._perPage;
                // custom sort params
                if (params._sortField) {
                    params._sort = params._sortField;
                    params._order = params._sortDir;
                    delete params._sortField;
                    delete params._sortDir;
                }
                // custom filters
                if (params._filters) {
                    for (var filter in params._filters) {
                        params[filter] = params._filters[filter];
                    }
                    delete params._filters;
                }
            }
            return { params: params };
        });
    }])

    .controller('AdminCtrl', function () {


  });
