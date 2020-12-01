pipeline {
    agent { docker { image 'node:12-alpine3.12' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}