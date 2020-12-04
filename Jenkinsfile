/* groovylint-disable CompileStatic, DuplicateStringLiteral, NestedBlockDepth */
pipeline {
    agent { docker { image 'node:12.19.0' } }
    stages {
        stage('Setup') {
            steps {
                dir('extension') {
                    withCredentials([
                        file(credentialsId: 'ENV_PRODUCTION_FILE', variable: 'ENV_PRODUCTION_FILE'),
                        file(credentialsId: 'ENV_DEVELOPMENT_FILE', variable: 'ENV_DEVELOPMENT_FILE')
                        ]) {
                        sh 'cp $ENV_DEVELOPMENT_FILE ./.env.development'
                        sh 'cp $ENV_PRODUCTION_FILE ./.env.production'
                        }
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
