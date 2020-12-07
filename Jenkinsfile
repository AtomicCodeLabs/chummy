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
                            sh '''
                                rm -rf ./.env*
                                cp $ENV_DEVELOPMENT_FILE ./.env.development
                                cp $ENV_PRODUCTION_FILE ./.env.production
                            '''
                        }
                }
                withCredentials([
                    usernamePassword(
                        credentialsId: 'AWS_CREDENTIALS',
                        usernameVariable: 'KEY',
                        passwordVariable: 'SECRET_KEY'
                        )
                    ]) {
                        sh '''
                            mkdir ~/.aws
                            printf "%s\n" "[default]" "aws_access_key_id=$KEY" "aws_secret_access_key=$SECRET_KEY" >~/.aws/credentials
                            printf "%s\n" "[default]" "region = us-west-2" >~/.aws/config
                        '''
                    }
                sh 'yarn --version'
            }
        }
        stage('Build') {
            steps {
                dir('extension') {
                    sh '''
                        yarn install --frozen-lockfile
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
                        cypress install
                        yarn cy:run
                    '''
                }
            }
        }
        stage('Publish Assets') {
            steps {
                dir('extension/dist') {
                    script {
                        for (f in findFiles(glob: '*.gz')) {
                            sh "aws s3 cp ${f} s3://chummy-assets"
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            node('master') {
                cleanWs()
            }
        }
    }
}
