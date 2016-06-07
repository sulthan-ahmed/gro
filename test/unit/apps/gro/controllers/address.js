'use strict';

const proxyquire = require('proxyquire');
const BaseController = sinon.stub();
const ErrorController = require('hof').controllers.error;

const AddressController = proxyquire('../../../../../apps/gro/controllers/address', {
  'hof': {
    controllers: {
      base: BaseController,
      error: ErrorController
    }
  }
});

describe('apps/gro/controllers/address', () => {

  let controller;
  const req = {
    sessionModel: {
      get: sinon.stub(),
      set: sinon.stub()
    },
    form: {
      values: {
        address: 'Home Office, Marsham Street, London, SW1P 4DF'
      }
    }
  };
  const res = {
    locals: {
      backLink: ''
    }
  };
  const options = {
    template: 'index',
    fields: {
      address: {
        options: '1 addresses'
      }
    }
  };
  const formatAddress = [{
    'formatted_address': 'Home Office\nMarsham Street\nLondon\nSW1P 4DF'
  }];
  const expectedAddress = ['1 addresses',
    'Home Office, Marsham Street, London, SW1P 4DF'];
  const key = 'address';

  describe('.getValues()', () => {

    beforeEach(() => {
      controller = new AddressController(options);
      controller.options = options;
      BaseController.prototype.getValues = sinon.stub();
      req.sessionModel.get.withArgs('addresses').returns(formatAddress);
      controller.getValues(req, res);
    });

    it('calls BaseController getValues', () => {
      BaseController.prototype.getValues.should.have.been.called;
    });

    it('sets the list of addresses to the options', () => {
      controller.options.fields.address.options.should.deep.equal(expectedAddress);
    });

  });

  describe('.saveValues()', () => {

    beforeEach(() => {
      controller = new AddressController(options);
      BaseController.prototype.saveValues = sinon.stub();
      controller.saveValues(req);
    });

    it('calls BaseController saveValues', () => {
      BaseController.prototype.saveValues.should.have.been.called;
    });

    it('adds new session Model values for the address', () => {
      req.sessionModel.set.should.have.been.calledWith('address-text', 'Home Office\nMarsham Street\nLondon\nSW1P 4DF');
    });

  });

  describe('.validateField()', () => {

    beforeEach(() => {
      controller = new AddressController(options);
      controller.options = options;
      ErrorController.prototype.validateField = sinon.stub();
      controller.validateField(key, req);
    });

    it('returns undefined when the field does not equal options.field.address', () => {
      should.equal(controller.validateField(key, req), undefined);
    });

    it('returns an error controller when the field equals options.field.address', () => {
      req.form.values.address = '1 addresses';
      const fieldValidation = controller.validateField(key, req);
      fieldValidation.should.be.an.instanceof(ErrorController);
      fieldValidation.should.have.property('key').and.equal('address');
      fieldValidation.should.have.property('type').and.equal('required');
    });

  });

});
