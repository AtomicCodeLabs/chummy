pipeline {
    agent { dockerfile true }
    environment {
        ENV_PRODUCTION_SECRET_KEY = credentials('env-production-secret-key')
    }
    stages {
        stage('Setup') {
            steps {
                dir('envs') {
                    sh 'cp /data/.env.development ./.env.development'
                    sh 'cp /data/.env.production ./.env.production'
                    sh 'ls -alF'
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
