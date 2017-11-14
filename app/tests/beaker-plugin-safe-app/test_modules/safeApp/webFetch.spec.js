let should = require('should');
let testHelpers = require('../helpers');

async function createRandomDomain(appHandle, content, path, service) {
  const domain = `test_${Math.round(Math.random() * 100000)}`;

  const serviceMdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_WWW);
  await window.safeMutableData.quickSetup(serviceMdHandle, {})
  const nfsHandle = await window.safeMutableData.emulateAs(serviceMdHandle, 'NFS');
  const fileHandle = await window.safeNfs.create(nfsHandle, content);
  await window.safeNfs.insert(nfsHandle, fileHandle, path);
  const dnsName = await window.safeCrypto.sha3Hash(appHandle, domain);
  const publicIdMDHandle = await window.safeMutableData.newPublic(appHandle, dnsName, testHelpers.TYPE_TAG_DNS);
  const serviceNameAndTag = await window.safeMutableData.getNameAndTag(serviceMdHandle);
  let entry = {};
  entry[service] = serviceNameAndTag.name.buffer;
  const mdIsNowSaved = await window.safeMutableData.quickSetup(publicIdMDHandle, entry);
  const entriesHandle = await window.safeMutableData.getEntries(publicIdMDHandle);

  return domain;
}

describe('window.safeApp.webFetch', () => {
  it('fetches SAFE conventional web site from network', async () => {
    const appHandle = await testHelpers.authoriseAndConnect()
    const domain = await createRandomDomain(appHandle, 'Hello, SAFE world!', 'index.html', 'site');
    console.log(`safe://site.${domain}/index.html`);
    const fileData = await window.safeApp.webFetch(appHandle, `safe://site.${domain}/index.html`);
    console.log(fileData);
  });

  it('exists', () => {
    should.exist(window.safeApp.webFetch);
  });
});
