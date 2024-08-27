pipeline {
     agent any 
      tools {
          nodejs 'nodejs'
      }

    environment {
        // Define environment variables
        DOCKER_IMAGE  = "devops4noobs/frontend:${BUILD_NUMBER}"
        DOCKER_CREDENTIALS_ID   = "docker-hub-credentials"
        REGISTRY_URL = "https://index.docker.io/v1/"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
                // If you're using yarn, you would do: sh 'yarn install'
            }
        }

        stage('Build code') {
            steps {
                // Build the React application
                sh 'npm run build'
                // If you're using yarn, you would do: sh 'yarn build'
            }
        }

        /*stage('Test') {
            steps {
                // Run tests for the React application
                sh 'npm test -- --watchAll=false'
                // If you're using yarn, you would do: sh 'yarn test --watchAll=false'
            }
        }*/

        stage('Build Docker Image') {
            steps {
                // Build Docker image
                script {
                    docker.build(DOCKER_IMAGE)
                    //dockerImage = docker.build('registry:$BUILD_NUMBER')
                }
            }
        }

        

        stage('Push Docker Image') {
            steps {
                // Push the Docker image to the registry
                script {
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        docker.image(DOCKER_IMAGE).push()
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
    }
}