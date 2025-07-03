const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'admin-client',
  brokers: ['localhost:9092'],
});

const admin = kafka.admin();

async function createTopic() {
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: 'java-submissions',
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });
  console.log('✅ Topic created!');
  await admin.disconnect();
}

createTopic();
