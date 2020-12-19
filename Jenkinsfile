/* groovylint-disable CompileStatic, DuplicateStringLiteral, NestedBlockDepth */
version = '1.0.0'
largeFiles = ['popup', 'background.firebase']

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
                        file(credentialsId: 'ENV_DEVELOPMENT_FILE', variable: 'ENV_DEVELOPMENT_FILE'),
                        file(credentialsId: 'KEY_PEM_FILE', variable: 'KEY_PEM_FILE')
                        ]) {
                            sh '''
                                rm -rf ./.env*
                                rm -rf ./key.pem
                                cp $ENV_DEVELOPMENT_FILE ./.env.development
                                cp $ENV_PRODUCTION_FILE ./.env.production
                                cp $KEY_PEM_FILE ./key.pem
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
                dir('extension') {
                    sh '''
                        yarn install --frozen-lockfile
                        yarn cypress install
                        yarn --version
                    '''
                }
            }
        }
        stage('Pre-Build Checks') {
            steps {
                dir('extension') {
                    sh '''
                        yarn lint:check
                        yarn format:check
                    '''
                }
            }
        }
        stage('Build') {
            parallel {
                stage ('Moz') {
                    steps {
                        dir('extension') {
                            sh 'yarn build:moz'
                        }
                    }
                }
                stage ('Web') {
                    steps {
                        dir('extension') {
                            sh 'yarn build:web'
                        }
                    }
                }
            }
        }
        stage('Test & Publish') {
            parallel {
                stage ('Moz') {
                    steps {
                        dir('extension') {
                            sh 'yarn cy:run:moz'
                        }
                        dir('extension/dist') {
                            sh "zip -r dist_${version}.moz.zip web"
                            sh "aws s3 cp dist_${version}.moz.zip s3://chummy-assets"
                        }
                    }
                }
                stage ('Web') {
                    steps {
                        // Only publish chrome assets, bc Mozilla doesn't allow remote files
                        // Prepublish assets so that tests will pass
                        dir('extension/dist') {
                            script {
                                largeFiles.each { f ->
                                    sh "aws s3 cp web/${f}_${version}.js s3://chummy-assets"
                                    sh "rm -f web/${f}_${version}.js"
                                }
                            }
                        }
                        dir('extension') {
                            sh 'yarn cy:run:web'
                        }
                        dir('extension/dist') {
                            sh "zip -r dist_${version}.web.zip web"
                            sh "aws s3 cp dist_${version}.web.zip s3://chummy-assets"
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
