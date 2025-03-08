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

	//user routes
	{Path: "/user/add", Security: "Public", Method: "POST", Handler: handlers.AddUser},
	{Path: "/user", Security: "Public", Method: "GET", Handler: handlers.GetAllUsers},
	{Path: "/user/:id", Security: "Public", Method: "GET", Handler: handlers.GetUserByID},
	{Path: "/user/:id", Security: "Public", Method: "PUT", Handler: handlers.UpdateUser},
	{Path: "/user/:id", Security: "Public", Method: "DELETE", Handler: handlers.DeleteUser},
	{Path: "/user/approve/:id", Security: "Admin", Method: "PUT", Handler: handlers.ApproveUser},
}

func NewRouter() *gin.Engine {
	r := gin.Default()

	// Enable CORS for all routes
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

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
			registerRoute(userAuth, route)
		}
	}

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
