pipeline {
    agent { docker { image 'node:12.19.0' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}