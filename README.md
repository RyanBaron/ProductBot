# ProductBot Project

ProductBot is a web application that does amazing things with cats!

## Prerequisites

Before you can run ProductBot, make sure you have the following installed on your system:

- Docker
- Docker Compose

## Getting Started

These instructions will help you set up and run the ProductBot application locally.

1. Clone the repository:

   <pre>
   git clone <repository_url>
   cd ProductBot
   </pre>

2. Build and start the Docker containers:

   <pre>
   docker-compose up --build
   </pre>

   This command will build and start both the frontend and backend services defined in the `docker-compose.yml` file.

3. Access the ProductBot application:

   - Frontend: Open a web browser and navigate to http://localhost:3000
   - Backend: The backend API is running on http://localhost:5000

## Stopping the Application

To stop the ProductBot application and shut down the Docker containers, use the following command:

<pre>
docker-compose down
</pre>

## Configuration

- Frontend configuration can be found in `frontend/.env`
- Backend configuration can be found in `backend/.env`

## Contributing

If you would like to contribute to ProductBot, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
