# Spirit11
## Usage
To start using Spirit11, follow these steps:

1. **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for the required variables.

2. **Run the application:**
    ```bash
    go run main.go
    ```

3. **Access the application:**
    Open your web browser and navigate to `http://localhost:8080`.

## API Endpoints
Spirit11 provides the following API endpoints:

- **Teams**
  - `GET /teams` - List all teams
  - `POST /teams` - Create a new team
  - `GET /teams/{id}` - Get a specific team
  - `PUT /teams/{id}` - Update a specific team
  - `DELETE /teams/{id}` - Delete a specific team

- **Players**
  - `GET /players` - List all players
  - `POST /players` - Add a new player
  - `GET /players/{id}` - Get a specific player
  - `PUT /players/{id}` - Update a specific player
  - `DELETE /players/{id}` - Delete a specific player

## Models
The following models are used in Spirit11:

- **Team**
  - `id` (integer)
  - `name` (string)
  - `city` (string)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **Player**
  - `id` (integer)
  - `name` (string)
  - `age` (integer)
  - `team_id` (integer)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.