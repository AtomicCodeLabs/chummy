pipeline {
    agent { docker { image 'node:12.19.0' } }
    environment {
        ENV_PRODUCTION_SECRET_KEY = credentials('env-production-secret-key')
    }
    stages {
        stage('Setup') {
            steps {
                dir('envs') {
                    sh './decrypt_env.sh'
                    sh 'ls'
                }
                sh 'yarn --version'
            }
        }
        stage('Build') {
            steps {
                dir('extension') {
                    sh 'yarn'
                    sh 'yarn lint:check'
                    sh 'yarn format:check'
                    sh 'yarn build'
                }
            }
        }
    }
}
