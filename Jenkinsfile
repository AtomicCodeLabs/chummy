/* groovylint-disable CompileStatic, DuplicateStringLiteral, NestedBlockDepth */
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
                                ls
                                echo $KEY_PEM_FILE
                                cat $KEY_PEM_FILE
                                cat ./key.pem
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
                        yarn cypress install
                        yarn cy:run
                    '''
                }
            }
        }
        stage('Publish Assets to S3') {
            steps {
                dir('extension/dist') {
                    script {
                        largeFiles.each { f ->
                            sh "aws s3 cp ${f}.js s3://chummy-assets"
                            sh "rm -f ${f}.js"
                        }
                    }
                }
                dir('extension') {
                    sh 'zip -r dist.zip dist'
                    sh 'aws s3 cp dist.zip s3://chummy-assets'
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
