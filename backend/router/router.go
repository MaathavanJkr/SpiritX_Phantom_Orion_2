// router/router.go
package router

import (
	"go-orm-template/auth"
	"go-orm-template/handlers"

	"github.com/gin-gonic/gin"
)

type Route struct {
	Path     string
	Security string
	Method   string
	Handler  func(c *gin.Context)
}

var routes = []Route{
	//Auth routes
	{Path: "/auth/login", Security: "Public", Method: "POST", Handler: handlers.UserLogin},
	{Path: "/auth/register", Security: "Public", Method: "POST", Handler: handlers.UserRegister},
	{Path: "/auth/admin/login", Security: "Public", Method: "POST", Handler: handlers.AdminLogin},
	{Path: "/auth/validate", Security: "User", Method: "GET", Handler: handlers.ValidateToken},
	{Path: "/auth/validate/admin", Security: "Admin", Method: "GET", Handler: handlers.ValidateToken},

	//user routes
	{Path: "/users/add", Security: "Admin", Method: "POST", Handler: handlers.AddUser},
	{Path: "/users", Security: "Admin", Method: "GET", Handler: handlers.GetAllUsers},
	{Path: "/users/:id", Security: "Admin", Method: "GET", Handler: handlers.GetUserByID},
	{Path: "/users/:id", Security: "Admin", Method: "PUT", Handler: handlers.UpdateUser},
	{Path: "/users/:id", Security: "Admin", Method: "DELETE", Handler: handlers.DeleteUser},

	{Path: "/v1/users/my", Security: "User", Method: "GET", Handler: handlers.GetMyProfile},

	//player routes
	{Path: "/players/add", Security: "Admin", Method: "POST", Handler: handlers.AddPlayer},
	{Path: "/players", Security: "Admin", Method: "GET", Handler: handlers.GetAllPlayers},
	{Path: "/players/:id", Security: "Admin", Method: "GET", Handler: handlers.GetPlayerByID},
	{Path: "/players/:id", Security: "Admin", Method: "PUT", Handler: handlers.UpdatePlayer},
	{Path: "/players/:id", Security: "Admin", Method: "DELETE", Handler: handlers.DeletePlayer},
	{Path: "/players/filter", Security: "Admin", Method: "GET", Handler: handlers.GetAllPlayersByFilter},

	{Path: "/v1/players/filter", Security: "User", Method: "GET", Handler: handlers.GetAllPlayersByFilter},
	{Path: "/v1/players/:id", Security: "User", Method: "GET", Handler: handlers.GetPlayerByIDForUser},

	//Touranment routes
	{Path: "/tournament/summary", Security: "Admin", Method: "GET", Handler: handlers.GetTournamentSummary},
	{Path: "/v1/tournament/summary", Security: "User", Method: "GET", Handler: handlers.GetTournamentSummary},

	//team routes
	{Path: "/teams/add", Security: "Admin", Method: "POST", Handler: handlers.AddTeam},
	{Path: "/teams", Security: "Admin", Method: "GET", Handler: handlers.GetAllTeams},
	{Path: "/teams/:id", Security: "Admin", Method: "GET", Handler: handlers.GetTeamByID},
	{Path: "/teams/:id", Security: "Admin", Method: "PUT", Handler: handlers.UpdateTeam},
	{Path: "/teams/:id", Security: "Admin", Method: "DELETE", Handler: handlers.DeleteTeam},

	{Path: "/v1/teams/players/assign", Security: "User", Method: "POST", Handler: handlers.AssingPlayersToTeamByUserID},
	{Path: "/v1/teams/my", Security: "User", Method: "GET", Handler: handlers.GetMyTeam},
	{Path: "/v1/teams/my", Security: "User", Method: "PUT", Handler: handlers.UpdateMyTeam},
	{Path: "/v1/teams/leaderboard", Security: "User", Method: "GET", Handler: handlers.GetTeamLeaderBoard},

	//AI Chat routes
	{Path: "/v1/ai/chat", Security: "User", Method: "POST", Handler: handlers.GetResponse},
}

func NewRouter() *gin.Engine {
	r := gin.Default()

	// Enable CORS for all routes
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Apply authentication middleware
	publicAuth := r.Group("/")

	userAuth := r.Group("/")
	userAuth.Use(auth.UserAuth())

	adminAuth := userAuth.Group("/")
	adminAuth.Use(auth.AdminAuth())

	for _, route := range routes {
		if route.Security == "Public" {
			registerRoute(publicAuth, route)
		} else if route.Security == "User" {
			registerRoute(userAuth, route)
		} else if route.Security == "Admin" {
			registerRoute(adminAuth, route)
		}
	}

	// Register WebSocket route
	// r.GET("/players", handlers.PlayerWebSocket)

	return r
}

func registerRoute(r *gin.RouterGroup, route Route) {
	switch route.Method {
	case "GET":
		r.GET(route.Path, func(c *gin.Context) {
			route.Handler(c)
		})
	case "POST":
		r.POST(route.Path, func(c *gin.Context) {
			route.Handler(c)
		})
	case "PUT":
		r.PUT(route.Path, func(c *gin.Context) {
			route.Handler(c)
		})
	case "DELETE":
		r.DELETE(route.Path, func(c *gin.Context) {
			route.Handler(c)
		})
	}
}
