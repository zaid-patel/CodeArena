// producer.js
import { Kafka } from 'kafkajs';
// import { TOPIC_NAME } from './config.js';

const kafka = new Kafka({
  clientId: 'code-producer',
  brokers: ['localhost:9093'],
});

const producer = kafka.producer();

export async function sendSubmission(TOPIC_NAME='java-submissions',code,problemId,problemTitle,testcasecnt,submissionId,checkerCode) {
  await producer.connect();

  const payload = {
    code,
    problemId,
    testcasecnt,
    problemTitle,
    current:1,
    submissionId,
    checkerCode
  };

  await producer.send({
    topic: TOPIC_NAME,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log('Code sent to queue!');
  
}
