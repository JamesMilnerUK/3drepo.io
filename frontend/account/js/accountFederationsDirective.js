/**
 *	Copyright (C) 2016 3D Repo Ltd
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as
 *	published by the Free Software Foundation, either version 3 of the
 *	License, or (at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *
 *	You should have received a copy of the GNU Affero General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
	"use strict";

	angular.module("3drepo")
		.directive("accountFederations", accountFederations);

	function accountFederations() {
		return {
			restrict: 'EA',
			templateUrl: 'accountFederations.html',
			scope: {
				account: "=",
				accounts: "=",
				onShowPage: "&",
				quota: "="
			},
			controller: AccountFederationsCtrl,
			controllerAs: 'vm',
			bindToController: true
		};
	}

	AccountFederationsCtrl.$inject = ["$scope", "UtilsService"];

	function AccountFederationsCtrl ($scope, UtilsService) {
		var vm = this;

		// Init
		vm.showInfo = true;
		vm.federations = [
			{
				name: "Cheese",
				projects: []
			},
			{
				name: "Bacon",
				projects: []
			}
		];
		vm.showInfo = (vm.federations.length === 0);
		vm.newFederationData = {};

		/*
		 * Watch accounts input
		 */
		$scope.$watch("vm.accounts", function () {
			if (angular.isDefined(vm.accounts)) {
				vm.accountsCopy = angular.copy(vm.accounts);
			}
		});

		/*
		 * Watch the new federation name
		 */
		/*
		$scope.$watch("vm.newFederationData.name", function () {
			vm.newFederationButtonDisabled = (angular.isUndefined(vm.newFederationData.name)) || (vm.newFederationData.name === "");
		});
		*/

		/*
		 * Watch for change in edited federation
		 */
		$scope.$watch("vm.newFederationData", function () {
			if (vm.federationOriginalData === null) {
				vm.newFederationButtonDisabled = (angular.isUndefined(vm.newFederationData.name)) || (vm.newFederationData.name === "");
			}
			else {
				vm.newFederationButtonDisabled = angular.equals(vm.newFederationData, vm.federationOriginalData);
			}
		}, true);

		/**
		 * Open the federation dialog
		 *
		 * @param event
		 */
		vm.setupNewFederation = function (event) {
			vm.federationOriginalData = null;
			vm.newFederationData = {projects: []};
			UtilsService.showDialog("federationDialog.html", $scope, event);
		};

		/**
		 * Close the federation dialog
		 *
		 */
		vm.closeDialog = function () {
			UtilsService.closeDialog();
		};

		/**
		 * Toggle showing of projects in an account
		 *
		 * @param index
		 */
		vm.toggleShowProjects = function (index) {
			vm.accountsCopy[index].showProjects = !vm.accountsCopy[index].showProjects;
			vm.accountsCopy[index].showProjectsIcon = vm.accountsCopy[index].showProjects ? "folder_open" : "folder";
		};

		/**
		 * Add a project to a federation
		 *
		 * @param accountIndex
		 * @param projectIndex
		 */
		vm.addToFederation = function (accountIndex, projectIndex) {
			vm.newFederationData.projects.push({
				accountIndex: accountIndex,
				account: vm.accountsCopy[accountIndex],
				projectIndex: projectIndex,
				project: vm.accountsCopy[accountIndex].projects[projectIndex]
			});

			vm.accountsCopy[accountIndex].projects[projectIndex].federated = true;
		};

		/**
		 * Remove a project from a federation
		 *
		 * @param index
		 */
		vm.removeFromFederation = function (index) {
			var item = vm.newFederationData.projects.splice(index, 1);
			vm.accountsCopy[item[0].accountIndex].projects[item[0].projectIndex].federated = false;
		};

		/**
		 * Save a federation
		 */
		vm.saveFederation = function () {
		};

		/**
		 * Edit a federation
		 *
		 * @param event
		 * @param index
		 */
		vm.editFederation = function (event, index) {
			vm.federationOriginalData = vm.federations[index];
			vm.newFederationData = angular.copy(vm.federationOriginalData);
			UtilsService.showDialog("federationDialog.html", $scope, event);
		};
	}
}());