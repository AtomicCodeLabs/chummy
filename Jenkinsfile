/* groovylint-disable CompileStatic, DuplicateStringLiteral, NestedBlockDepth */
pipeline {
    agent {
        docker {
            image 'alexkim205/ci:jenkins-node'
            args '-u root:root'
        }
    }
    stages {
        stage('Setup') {
            steps {
                dir('extension') {
                    withCredentials([
                        file(credentialsId: 'ENV_PRODUCTION_FILE', variable: 'ENV_PRODUCTION_FILE'),
                        file(credentialsId: 'ENV_DEVELOPMENT_FILE', variable: 'ENV_DEVELOPMENT_FILE')
                        ]) {
                        sh 'ln -s $ENV_DEVELOPMENT_FILE ./.env.development'
                        sh 'ln -s $ENV_PRODUCTION_FILE ./.env.production'
                        }
                }
                sh 'yarn --version'
            }
        }
        stage('Build') {
            steps {
                dir('extension') {
                    sh '''
                        yarn
                        yarn lint:check
                        yarn format:check
                        yarn build
                    '''
                }
            }
        }
        stage('Test') {
            steps {
                dir('extension') {
                    sh '''
                        whoami
                        yarn cy:run
                    '''
                }
            }
        }
        stage('Publish Assets') {
            steps {
                dir('extension/dist') {
                    script {
                        withAWS(credentials: 'AWS_CREDENTIALS') {
                            for (f in findFiles(glob: '*.gz')) {
                                s3Upload(file:"$f", bucket:'chummy-assets', path:"$f")
                            }
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
