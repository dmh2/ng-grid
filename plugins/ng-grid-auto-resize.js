/**
 * ng-grid (v 2.x) allows the grid to be redrawn correctly when the window is resized,
 * however resizing of just the directive's parent container doesn't trigger a grid redraw correctly (as of version 2.0.7).
 * This plugin watches the dimensions of the grid.$canvas element and rebuilds the grid accordingly.
 */
function ngGridAutoResizePlugin () {
    var self = this;
    self.grid = null;
    self.scope = null;
    self.init = function (scope, grid, services) {
        self.domUtilityService = services.DomUtilityService;
        self.grid = grid;
        self.scope = scope;

        var resizeThrottle;
        var resizeWithParent = function() {
            clearTimeout(resizeThrottle);
            resizeThrottle = setTimeout(function() {
                //Throttle a timeout for IE8 compatibility
                self.domUtilityService.RebuildGrid(self.scope,grid);
                // Force a display update.
                self.scope.$apply() ;
            }, 10);
        };

        self.scope.$watch(
            function () {
                return [self.grid.$canvas[0].offsetParent.clientWidth, self.grid.$canvas[0].offsetParent.clientHeight].join('x');
            },
            function (value) {
                resizeWithParent() ;
            }
        ) ;
    };
}
