/* groovylint-disable CompileStatic, DuplicateStringLiteral, NestedBlockDepth */
largeFiles = ['popup', 'background.firebase']
packageJson = readJSON file: '../../package.json'

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
                        yarn build:web
                        yarn build:moz
                    '''
                }
            }
        }
        stage('Pre-publish Assets to S3') {
            steps {
                dir('extension/dist/web') {
                    // Only publish chrome assets, bc Mozilla doesn't allow remote files
                    script {
                        largeFiles.each { f ->
                            sh "aws s3 cp ${f}_${packageJson.version}.js s3://chummy-assets"
                            sh "rm -f ${f}_${packageJson.version}.js"
                        }
                    }
                }
            }
        }
        stage('Test') {
            steps {
                dir('extension') {
                    sh '''
                        ls dist/
                        yarn cypress install
                        yarn cy:run
                    '''
                }
            }
        }
        stage('Publish Assets to S3') {
            steps {
                dir('extension/dist/web') {
                    // Only publish chrome assets, bc Mozilla doesn't allow remote files
                    script {
                        largeFiles.each { f ->
                            sh "aws s3 cp ${f}_${packageJson.version}.js s3://chummy-assets"
                            sh "rm -f ${f}_${packageJson.version}.js"
                        }
                    }
                }
                dir('extension/dist') {
                    sh '''
                        zip -r dist.web.zip web
                        zip -r dist.moz.zip moz
                        aws s3 cp dist.web.zip s3://chummy-assets
                        aws s3 cp dist.moz.zip s3://chummy-assets
                    '''
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
