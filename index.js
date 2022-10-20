const { Datastore } = require('@google-cloud/datastore');

process.env.DATASTORE_EMULATOR_HOST = 'localhost:8081';

const datastore = new Datastore();

async function queryThenInsert(kind) {
  const transaction = datastore.transaction();
  await transaction.run();

  await transaction.runQuery(
    transaction.createQuery(kind).filter('a', '=', 'b')
  );

  transaction.insert({ key: datastore.key(kind), data: {} });

  return transaction.commit();
}

async function main() {
  try {
    await Promise.all([
      queryThenInsert('Foo'),
      queryThenInsert('Bar'),
    ]);
  } catch (e) {
    // Error: 10 ABORTED: too much contention on these datastore entities. please try again.
    console.error(e);
  }
}

main();
