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
                        yarn build:moz
                        yarn build:web
                    '''
                }
            }
        }
        stage('Test Moz Build') {
            steps {
                dir('extension') {
                    sh '''
                        yarn cypress install
                        yarn cy:run:moz
                    '''
                }
            }
        }
        stage('Publish Moz `dist/`') {
            steps {
                dir('extension/dist') {
                    sh "zip -r dist_${version}.moz.zip web"
                    sh "aws s3 cp dist_${version}.moz.zip s3://chummy-assets"
                }
            }
        }
        stage('Publish Web Assets') {
            steps {
                dir('extension/dist/web') {
                    // Only publish chrome assets, bc Mozilla doesn't allow remote files
                    script {
                        largeFiles.each { f ->
                            sh "aws s3 cp ${f}_${version}.js s3://chummy-assets"
                            sh "rm -f ${f}_${version}.js"
                        }
                    }
                }
            }
        }
        stage('Test Web Build') {
            steps {
                dir('extension') {
                    sh '''
                        yarn cy:run:web
                    '''
                }
            }
        }
        stage('Publish Web `dist/`') {
            steps {
                dir('extension/dist') {
                    sh "zip -r dist_${version}.web.zip web"
                    sh "aws s3 cp dist_${version}.web.zip s3://chummy-assets"
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
