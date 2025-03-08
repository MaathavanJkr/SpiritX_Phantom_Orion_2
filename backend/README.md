# Go ORM Template

This is a template project for building Go applications with an ORM (Object-Relational Mapping) library. It provides a starting point for developing database-driven applications in Go.

## Features

- ORM integration with popular databases such as MySQL, PostgreSQL, and SQLite.
- Structured project layout for better organization and maintainability.
- Example CRUD operations to demonstrate basic usage of the ORM library.
- Authentication implementation with JWT.
- Configuration file for easy database connection setup.

## Prerequisites
Before getting started with this template project, make sure you have the following prerequisites installed on your system:
- Go (version 1.16 or higher)
- Git

## Project Folder Structure
The project folder structure follows a standard layout for better organization and maintainability. Here is an overview of the main directories and files:

```
.
├── auth
│   ├── auth.go
│   ├── hash.go
│   └── token.go
├── handlers
│   └── handler.go
├── db
│   └── db.go
├── models
│   └── model.go
├── routes
│   └── routes.go
├── .env.example
├── .gitignore
├── go.mod
├── go.sum
├── main.go
├── LICENSE
└── README.md
```

- `cmd`: Contains the main entry point of the application.
- `config`: Holds the configuration related code and files.
- `controllers`: Contains the controllers responsible for handling HTTP requests.
- `database`: Includes the code for database connection and initialization.
- `models`: Holds the data models or structs used by the ORM library.
- `routes`: Defines the application routes and their corresponding handlers.
- `.env.example`: An example file for configuring environmental variables.
- `.gitignore`: Specifies the files and directories to be ignored by Git.
- `go.mod` and `go.sum`: Files used by Go's module system for dependency management.
- `LICENSE`: The license file for the project.
- `README.md`: The main documentation file.

Feel free to modify this structure according to your project's needs.


## Getting Started

To get started with this template project, follow these steps:

1. Clone the repository: `git clone https://github.com/MaathavanJkr/go-orm-template.git`
2. Change the directory to the template: `git clone https://github.com/MaathavanJkr/go-orm-template.git`
3. Install the required dependencies: `go mod download`
4. Copy the env example file and configure environmental variables: `cp .env.example .env`
5. Run the application: `go run .`

## Usage

This template project provides a basic CRUD (Create, Read, Update, Delete) functionality for a sample entity. You can use this as a starting point and modify it according to your application's requirements.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
