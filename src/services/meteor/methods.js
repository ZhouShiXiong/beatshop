import { MClient } from '../../config/ddp.js';
import { getStore } from '../../tools/localStorage.js';
import App from '../../config/app.json'

export default function getRemoteMeteor(
    dispatch,
     getState,
      collectionType,
       remoteMethodName,
        params,
         successAction,
          failAction){
    let loginToken = getStore("stampedToken");
    let endParams = [loginToken, App.name];
    params.forEach(element => {
        if(element){
            endParams.push(element);
        }
    });
    let tempResult = null;
    MClient.method(remoteMethodName, endParams);
       
        return MClient.on("result", message => {
           
            if (!message.error && message.result) {
                
                if (message.result.type === collectionType) {
                   
                    if (message.result.fromMethod === remoteMethodName) {
                        if(tempResult ===message.result.msg){
                            return dispatch(successAction(message.result.msg));
                        }else{
                            tempResult = message.result.msg
                        }
                        return dispatch(successAction(message.result.msg));
                    }
                }
                if(message.result.type === "error"){
                    
                    return dispatch(failAction(message.result.reason));
                }
                if(message.result.type === "fail"){
                   
                   return dispatch(failAction(message.result.reason));
               }
            }else{
                return dispatch(failAction(message.error.error));
            }
        })
       
    }
