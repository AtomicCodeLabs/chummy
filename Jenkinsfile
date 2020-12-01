pipeline {
    agent { docker { image 'node:12-alpine' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}