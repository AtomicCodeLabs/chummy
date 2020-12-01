pipeline {
    agent { docker { image 'node:12.19.0' } }
    environment {
        ENV_PRODUCTION_SECRET_KEY = credentials('env-production-secret-key')
    }
    stages {
        stage('Setup') {
            steps {
                sh 'echo $ENV_PRODUCTION_SECRET_KEY'
                dir('envs') {
                    sh 'chmod +x decrypt_env.sh'
                    sh './decrypt_env.sh'
                    sh 'ls'
                }
                sh 'cd extension'
                sh 'npm install -g yarn'
                sh 'yarn --version'
            }
        }
        stage('Build') {
            steps {
                sh 'cd extension'
                sh 'yarn'
                sh 'yarn lint:check'
                sh 'yarn format:check'
                sh 'yarn build'
            }
        }
    }
}
