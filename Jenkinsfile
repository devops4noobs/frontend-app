pipeline {
     agent any 
      tools {
          nodejs 'nodejs'
      }

    environment {
        // Define environment variables
        SCANNER_HOME=tool 'sonar-scanner'
        DOCKER_IMAGE  = "devops4noobs/frontend:${BUILD_NUMBER}"
        DOCKER_CREDENTIALS_ID   = "docker-hub-credentials"
        REGISTRY_URL = "https://index.docker.io/v1/"
    }

    stages {

        stage('Cleaning Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                checkout scm
            }
        }

        stage('Sonarqube Analysis') {
            steps {
                    withSonarQubeEnv('sonar-server') {
                        sh '''' $SCANNER_HOME/bin/sonar-scanner \
                         -Dsonar.projectKey=frontend-app \
                         -Dsonar.sources=. \
                         -Dsonar.host.url=http://35.156.47.158:9000 '''
                    }
            }
        }

        stage('Quality Check') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token' 
                }
            }
        }

        stage('OWASP Dependency-Check Scan') {
            steps {
               
        dependencyCheck additionalArguments: "--scan ./ --disableYarnAudit --disableNodeAudit --nvdApiKey 5c7f2699-a072-4b9d-a66c-9fc7e4671c8d", odcInstallation: 'DP-Check'
        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'

            }
        }

        stage('Trivy File Scan') {
            steps {
                    sh 'trivy fs . > trivyfs.txt'
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
                    sh 'docker system prune -f'
                    sh 'docker container prune -f'
                    docker.build(DOCKER_IMAGE)
                    //dockerImage = docker.build('registry:$BUILD_NUMBER')
                }
            }
        }

        

        stage('Push Docker Image') {
            steps {
                // Push the Docker image to the registry
                script {
                    docker.withRegistry(REGISTRY_URL, DOCKER_CREDENTIALS_ID) {
                        docker.image(DOCKER_IMAGE).push()
                    }
                }
            }
        }

        stage("Trivy Image Scan") {
            steps {
                sh 'trivy image ${DOCKER_IMAGE} > trivyimage.txt' 
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