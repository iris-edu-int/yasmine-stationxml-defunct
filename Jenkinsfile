pipeline {
    agent none
    stages {
        stage('Front-end') {
            node('docker1') {
                checkout(
                    [$class: 'GitSCM', branches: [[name: '*/v1_iris_jenkins']], 
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [[$class: 'SparseCheckoutPaths', sparseCheckoutPaths: [[path: 'frontend/*']]]], 
                    submoduleCfg: [], 
                    userRemoteConfigs: [[name: 'twister', url: 'https://github.com/iris-edu-int/twister-imct-editor.git']]]
                )
                agent {
                    dockerfile {
                       filename 'Dockerfile'
                       dir 'frontend'
                       label 'frontend-test'
                       //additionalBuildArgs  '--build-arg version=1.0.2'
                       //args '-v /tmp:/tmp'
                    }
                }
            	steps {
                	sh 'sencha app build'
            	}
            }
        }

        stage('Back-end') {
            node('docker1') {
                checkout(
                    [$class: 'GitSCM', branches: [[name: '*/v1_iris_jenkins']], 
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [[$class: 'SparseCheckoutPaths', sparseCheckoutPaths: [[path: 'backend/*']]]], 
                    submoduleCfg: [], 
                    userRemoteConfigs: [[name: 'twister', url: 'https://github.com/iris-edu-int/twister-imct-editor.git']]]
                )
                agent {
                    dockerfile {
                       filename 'Dockerfile'
                       dir 'backend'
                       label 'backend-test'
                       //additionalBuildArgs  '--build-arg version=1.0.2'
                       //args '-v /tmp:/tmp'
                    }
                }
            	steps {
                	sh 'imctapp.py syncdb upgrade heads'
            	}
	        }
        }
    }
}



