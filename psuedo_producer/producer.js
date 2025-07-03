// producer.js
const { Kafka } = require('kafkajs');
// import { TOPIC_NAME } from './config.js';

const kafka = new Kafka({
  clientId: 'code-producer',
  brokers: ['localhost:9093'],
});

const producer = kafka.producer();

async function sendTestSubmission() {
  await producer.connect();

  const payload = {
    verdict:"Accepted",
    statement:"Very smart",
    problemId:1,
    submissionId:5,
    exitCode:0}
// {
//     code: `
// public class Main {
//   public static void main(String[] args) {
//     java.util.Scanner sc = new java.util.Scanner(System.in);
//     int a = sc.nextInt();
//     int b = sc.nextInt();
//     while(a>0) b++;
//     System.out.println(a + b);
//   }
// }
//     `,
//     input: '2 3',
//     check_output: '5'
//   };

  await producer.send({
    topic: 'Submissions',
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log(' Submission sent successfully!');
  await producer.disconnect();
}

sendTestSubmission();
