env.HL_BUILD_MODE = "jenkins"

node('Lithium'){
    
   stage('get new version to repo') {
       checkout scm
       if (lastCommitIsBumpCommit()) {
            currentBuild.result = 'ABORTED'
            error('Последний коммит - результат сборки jenkins')
        }
        bat "git checkout ${env.BRANCH_NAME}"
        bat "git checkout -- ."
        bat "git pull"
        bat "git submodule update --init --recursive"
        bat "git submodule update --remote --merge"
   }
   stage("build and publish"){
        sh label: '', script: 'npm i'
        sh label: '', script: 'npm run build'
    }
}