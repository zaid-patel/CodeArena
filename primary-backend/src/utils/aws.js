
import pkg from 'aws-sdk';
const {S3} = pkg;
import path from "path";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { log } from 'console';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT
})


// nodejs



const BUCKET_NAME = 'zaidrepl';

// Helper to convert stream to string
const streamToString = async (stream) => {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
};
const fetchProblemData = async (problemTitle) => {
  const prefix = `problems/${problemTitle}/`;
  const testcasesPrefix = `${prefix}testcases/`;

  const listParams = {
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  };

  const listed = await s3.listObjectsV2(listParams).promise();
  const testCaseMap = {};
  let statementContent = '';

  for (const item of listed.Contents) {
    const key = item.Key;

    // Get statement
    if (key.endsWith('statement') || key.endsWith('statement.md')) {
      const file = await s3.getObject({ Bucket: BUCKET_NAME, Key: key }).promise();
      statementContent = file.Body.toString('utf-8');
      continue;
    }

    // Match: problems/Title/testcases/tc1/input.txt
    const match = key.match(/testcases\/(tc\d+)\/(input\.txt|output\.txt)$/);
    if (!match) continue;

    const [_, tcName, fileType] = match;

    if (!testCaseMap[tcName]) {
      testCaseMap[tcName] = {};
    }

    const file = await s3.getObject({ Bucket: BUCKET_NAME, Key: key }).promise();
    const content = file.Body.toString('utf-8');

    testCaseMap[tcName][fileType === 'input.txt' ? 'input' : 'output'] = content;
  }

  const testcases = Object.entries(testCaseMap).map(([name, { input, output }]) => ({
    name,
    input,
    output,
  }));

  return {
    statement: statementContent,
    testcases,
  };
};

const fetchSubmission = async (submissionId,userId) => {
  const prefix = `${userId}/${submissionId}`;
  console.log(prefix);
  
  const listParams = {
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  };

  const listed = await s3.listObjectsV2(listParams).promise();
  let submissionContent = '';

  // console.log(listed.C);
  

  for (const item of listed.Contents) {
    const key = item.Key;

   
      const file2 = await s3.getObject({ Bucket: BUCKET_NAME, Key: key }).promise();
      submissionContent = file2.Body.toString('utf-8');
  }

 

  return  submissionContent;
};


//  saveToS3(`project/${replId}`, filePath, content);

const saveToS3 = async (key, filePath, content) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET ?? "",
        Key: `${key}${filePath}`,
        Body: content
    }
    console.log(key+" "+filePath+""+content);
    console.log(process.env.AWS_S3_BUCKET);
    
    
    console.log("recursive log from save");
    await s3.putObject(params).promise()
}




export {

    saveToS3,
    fetchProblemData,
    fetchSubmission
}