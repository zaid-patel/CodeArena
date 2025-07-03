
import pkg from 'aws-sdk';
const {S3} = pkg;
import path from "path"
import fs from "fs"

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT
})


// nodejs



const BUCKET_NAME = 'zaidrepl';


const createFolder=(dirName)=>{
    return new Promise((resolve, reject) => {
        fs.mkdir(dirName,{recursive:true},(err)=>{
            if(err) return reject(err);
            else resolve();
        })
    })
}

const writeFile=async(filePath,content)=>{
    return new Promise(async(resolve,reject)=>{
        await createFolder(path.dirname(filePath))

        fs.writeFile(filePath,content,(err)=>{
            if(err) reject(err);
            else resolve();
        })
    })
}





const fetchS3Folder=async(src,destination)=>{
    try {
        console.log(src);
        
        
        const listParams={
            Bucket:BUCKET_NAME,
            Prefix:src,
        }
        console.log("recursive log from fetch");
        
        const listedObjects=await s3.listObjectsV2(listParams).promise()
    
        if(listedObjects.Contents){
            console.log(listedObjects.Contents.length);
            await Promise.all(listedObjects.Contents.map(async(obj)=>{
                
                
                const fileKey=obj.Key
                console.log(fileKey);
    
                if(fileKey){
                    const getObjectParams = {
                        Bucket: BUCKET_NAME ?? "",
                        Key: fileKey
                    };
                    console.log("recursive log from get");
                    const data = await s3.getObject(getObjectParams).promise();
    
                    if(data.Body){
                        const fileData=data.Body;
                        const filePath=`${destination}/${fileKey.replace(src,"")}`;
    
                        await writeFile(filePath,fileData);
    
                        console.log("main task completed (file copied from s3 to local)");
                        
                    }
                }
            }))
        }
    } catch (error) {
        console.log("fetchs3 error"+error);
        
    }

}





export {

    fetchS3Folder,
}