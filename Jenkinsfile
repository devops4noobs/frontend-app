pipeline {
     agent any 
      tools {
          nodejs 'nodejs'
      }

    environment {
        // Define environment variables
        //dockerImage  = ""
        //registryCredential  = "docker"
        //registry  = "devops4noobs/frontend"
        DOCKER_HUB_CREDENTIALS = credentials('docker')
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

        stage('Build') {
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
        stage('Login to Docker Hub') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image
                script {
                    sh 'docker build -t ":$BUILD_NUMBER" .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                // Push the Docker image to the registry
                script {
                    docker.withRegistry('', registryCredential) {
                        dockerImage.push() 
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