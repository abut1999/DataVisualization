pipeline {
  agent any
  stages {
    stage('Build image') {
      steps {
        script {
          dockerImage = docker.build imageName + ":$BUILD_NUMBER"
        }

      }
    }

    stage('Deploy image') {
      steps {
        script {
          docker.withRegistry("https://" + registry, registryCredentials) {
            dockerImage.push("$BUILD_NUMBER")
            dockerImage.push("latest")
          }
        }

      }
    }
  }

  post {
    always {
      sh "docker container prune -f"
      sh 'docker image prune -f'
    }
  }

  environment {
    registry = '451085167207.dkr.ecr.eu-central-1.amazonaws.com'
    imageName = 'architecturequote/aq-analytics'
    registryCredentials = 'ecr:eu-central-1:aws-credentials'
    dockerImage = ''
  }
}