env.HL_BUILD_MODE = "jenkins"

node('Rubidium'){
    
   stage('get new version to repo') {
       dir('/opt/usersite-build'){
           checkout([$class: 'GitSCM', branches: [[name: '*/fashion-logica']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'jenkins_all', url: 'https://git.hlcompany.ru/git/usersite.git']]])
        }
   }

    stage('build project') {
        // sh label: '', script: 'systemctl stop lkcrm4retail'
        // dir('/opt/SynthVisionBox/node'){
        //     sh label: '', script: 'npm install --only=prod'
        //     sh label: '', script: 'node db_updater.js'
        // }
        
        dir('/opt/usersite-build'){
        //    sh label: '', script: 'npm i'
        //    sh label: '', script: 'npm run build'
            sh label: '', script: 'ng build'
        }
       
        // sh label: '', script: 'systemctl start lkcrm4retail'
    }
   
}