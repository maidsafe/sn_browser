let should = require('should');
let testHelpers = require('./helpers');

describe('window safeApp', () => {
  it('initialises application', () => {
      testHelpers.initialiseApp().should.be.fulfilled();
  });

  it('initialises and returns appHandle as a 64 character string', () => {
      return testHelpers.initialiseApp().then(appHandle => {
        should(appHandle.length).equal(64);
      })
  });

  it('should throw informative error, if App info is malformed', () => {
    const malformedAppInfo = {
      id: 'net.maidsafe.test.javascript.id',
      named: 'JS Test'
    };

    should.throws(window.safeApp.initialise(malformedAppInfo));
  });

  it('should build an alternative if there is a scope', function() {
    this.timeout(30000);
    let firstAuthUri = null;
    let secondAuthUri = null;
    return testHelpers.initialiseApp()
    .then(appHandle => testHelpers.authoriseApp(appHandle).then(({appHandle, authUri}) => firstAuthUri = authUri))
    .then(() => testHelpers.initialiseApp('website'))
    .then(appHandle => testHelpers.authoriseApp(appHandle).then(({appHandle, authUri}) => secondAuthUri = authUri))
    .then(() => {
      firstAuthUri.should.not.equal(secondAuthUri)
    })
  });

  it('connects an unauthorised app to an unregistered session on the network', () => {
    return testHelpers.initialiseApp()
      .then(appHandle => {
        window.safeApp.connect(appHandle).should.be.fulfilled();
      })
  })

  it('authorises application and return some authentication uri', function() {
    this.timeout(30000);
    return testHelpers.initialiseApp()
    .then(appHandle => testHelpers.authoriseApp(appHandle))
    .then(({appHandle, authUri}) => {
      should(authUri).startWith('safe-')
    });
  });

  it('connects an authorised app to a registered session on the network', () => {
    testHelpers.authoriseAndConnect().should.be.fulfilled();
  })

  it('requests further container permissions', function() {
    this.timeout(30000);
    const permissions = {
      _videos: ['Read', 'Insert', 'Update']
    };

    return testHelpers.authoriseAndConnect()
    .then(appHandle => window.safeApp.authoriseContainer(appHandle, permissions).then(() => appHandle))
    .then(appHandle => window.safeApp.getContainersPermissions(appHandle))
    .then(permissions => {
      should(permissions).have.property("_videos");
      should(permissions._videos).have.property("Read", true);
      should(permissions._videos).have.property("Insert", true);
      should(permissions._videos).have.property("Update", true);
      should(permissions._videos).have.property("Delete", false);
      should(permissions._videos).have.property("ManagePermissions", false);
    })
  })

  it.skip('can request permissions for a Mutable Data structure created by another app', function() {
    this.timeout(30000);

    return testHelpers.createUnownedMutableData()
    .then(nameAndTag => testHelpers.authoriseAndConnect().then(appHandle => ({appHandle, nameAndTag})))
    .then(({appHandle, nameAndTag}) => {
      const permissions = [
        {
          type_tag: nameAndTag.tag,
          name: nameAndTag.name.buffer,
          perms: ['Insert']
        }
      ];
      return window.safeApp.authoriseShareMd(appHandle, permissions)
    })
  })

  //
  // it('should throw informative error, if App properties, excepting scope, are empty', () => {
  //   const test = () => appHelpers.autoref(new App({
  //     id: 'net.maidsafe.test.javascript.id',
  //     name: 'JS Test',
  //     vendor: ' ',
  //     scope: null
  //   }));
  //
  //   should.throws(test);
  // });
});
