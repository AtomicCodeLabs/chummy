pipeline {
    agent { docker { image 'node:12.19.0' } }
    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g yarn'
                sh 'yarn --version'
            }
        }
        stage('Build') {
            steps {
                sh 'yarn'
                sh 'yarn lint:check'
                sh 'yarn format:check'
                sh 'yarn build'
            }
        }
    }
}
