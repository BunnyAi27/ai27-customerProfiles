const deleteParameterBuilder = (eventBody, tenantConfig) => {
  const formattedDeleteParameters = { // DeleteProfileRequest
      ProfileId: eventBody.profileId, // required
      DomainName: tenantConfig.Item.customerProfileDomainName, // required
    }
    console.log("deleteParameterBuilder: ",formattedDeleteParameters);
  return formattedDeleteParameters;
};

const createParameterBuilder = (eventBody, tenantConfig) => {
  function removeEmptyStringProperties(obj) {
    for (const key in obj) {
      if (obj[key] === "") {
        delete obj[key]; // Remove the property if its value is an empty string
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        // If the value is an object, recursively check and remove empty string properties
        removeEmptyStringProperties(obj[key]);
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key]; // Remove the entire sub-object if it's empty
        }
      }
    }
  }

  const formattedCreateParameters = { // CreateProfileRequest
    DomainName: tenantConfig.Item.customerProfileDomainName, // required
    AdditionalInformation: eventBody.additionalInformation ?? "",
    AccountNumber: eventBody.accountNumber ?? "",
    BusinessName: eventBody.businessName ?? "",
    FirstName: eventBody.firstName ?? "",
    MiddleName: eventBody.middleName ?? "",
    LastName: eventBody.lastName ?? "",
    BirthDate: eventBody.birthDate ?? "",
    PhoneNumber: eventBody.phoneNumber ?? "",
    MobilePhoneNumber: eventBody.mobilePhoneNumber ?? "",
    HomePhoneNumber: eventBody.homePhoneNumber ?? "",
    BusinessPhoneNumber: eventBody.businessPhoneNumber ?? "",
    EmailAddress: eventBody.emailAddress ?? "",
    PersonalEmailAddress: eventBody.personalEmailAddress ?? "",
    BusinessEmailAddress: eventBody.businessEmailAddress ?? "",
    Address: { 
      Address1: eventBody.address1 ?? "",
      Address2: eventBody.address2 ?? "",
      Address3: eventBody.address3 ?? "",
      Address4: eventBody.address4 ?? "",
      City: eventBody.city ?? "",
      County: eventBody.country ?? "",
      State: eventBody.state ?? "",
      Province: eventBody.province ?? "",
      Country: eventBody.country ?? "",
      PostalCode: eventBody.postalCode ?? "",
    },
    ShippingAddress: {
      Address1: eventBody.shippingAddress1 ?? "",
      Address2: eventBody.shippingAddress2 ?? "",
      Address3: eventBody.shippingAddress3 ?? "",
      Address4: eventBody.shippingAddress4 ?? "",
      City: eventBody.shippingCity ?? "",
      County: eventBody.shippingCountry ?? "",
      State: eventBody.shippingState ?? "",
      Province: eventBody.shippingProvince ?? "",
      Country: eventBody.shippingCountry ?? "",
      PostalCode: eventBody.shippingPostalCode ?? "",
    },
    MailingAddress: {
      Address1: eventBody.mailingAddress1 ?? "",
      Address2: eventBody.mailingAddress2 ?? "",
      Address3: eventBody.mailingAddress3 ?? "",
      Address4: eventBody.mailingAddress4 ?? "",
      City: eventBody.mailingCity ?? "",
      County: eventBody.mailingCountry ?? "",
      State: eventBody.mailingState ?? "",
      Province: eventBody.mailingProvince ?? "",
      Country: eventBody.mailingCountry ?? "",
      PostalCode: eventBody.mailingPostalCode ?? "",
    },
    BillingAddress: {
      Address1: eventBody.billingAddress1 ?? "",
      Address2: eventBody.billingAddress2 ?? "",
      Address3: eventBody.billingAddress3 ?? "",
      Address4: eventBody.billingAddress4 ?? "",
      City: eventBody.billingCity ?? "",
      County: eventBody.billingCountry ?? "",
      State: eventBody.billingState ?? "",
      Province: eventBody.billingProvince ?? "",
      Country: eventBody.billingCountry ?? "",
      PostalCode: eventBody.billingPostalCode ?? "",
    },
    Attributes: eventBody.additionalAttributes ?? "",
    PartyTypeString: eventBody.partyType ?? "",
    GenderString: eventBody.gender ?? "",
  }

  removeEmptyStringProperties(formattedCreateParameters);
  
  console.info("formattedCreateParameters: ", formattedCreateParameters);
  return formattedCreateParameters;   
};

const searchParameterBuilder = (eventBody, tenantConfig) => {
  const formattedSearchParameters = { // SearchProfilesRequest
      //NextToken: "STRING_VALUE",
      //MaxResults: Number("int"),
      DomainName: tenantConfig.Item.customerProfileDomainName, // required
      KeyName: eventBody.keyName, // required
      Values: eventBody.keyValues, // of type array
      AdditionalSearchKeys: eventBody.additionalSearchKeys ?? "",
      LogicalOperator: eventBody.logicalOperator ?? "OR"//"AND" || "OR",
    }
    console.info("formattedSearchParameters: ", formattedSearchParameters);
  return formattedSearchParameters;   
};

const updateParameterBuilder = (eventBody,tenantConfig) => { // specifying an empty string value means that any existing value will be removed. Not specifying a string value means that any value already there will be kept.
  const formattedUpdateParameters = { // UpdateProfileRequest
      DomainName: tenantConfig.Item.customerProfileDomainName, // required
      ProfileId: eventBody.profileId, // required
      AdditionalInformation: eventBody.additionalInformation ?? "",
      AccountNumber: eventBody.accountNumber ?? "",
      BusinessName: eventBody.businessName ?? "",
      FirstName: eventBody.firstName ?? "",
      MiddleName: eventBody.middleName ?? "",
      LastName: eventBody.lastName ?? "",
      BirthDate: eventBody.birthDate ?? "",
      PhoneNumber: eventBody.phoneNumber ?? "",
      MobilePhoneNumber: eventBody.mobilePhoneNumber ?? "",
      HomePhoneNumber: eventBody.homePhoneNumber ?? "",
      BusinessPhoneNumber: eventBody.businessPhoneNumber ?? "",
      EmailAddress: eventBody.emailAddress ?? "",
      PersonalEmailAddress: eventBody.personalEmailAddress ?? "",
      BusinessEmailAddress: eventBody.businessEmailAddress ?? "",
      Address: { // UpdateAddress
        Address1: eventBody.address1 ?? "",
        Address2: eventBody.address2 ?? "",
        Address3: eventBody.address3 ?? "",
        Address4: eventBody.address4 ?? "",
        City: eventBody.city ?? "",
        County: eventBody.country ?? "",
        State: eventBody.state ?? "",
        Province: eventBody.province ?? "",
        Country: eventBody.country ?? "",
        PostalCode: eventBody.postalCode ?? "",
      },
      ShippingAddress: {
        Address1: eventBody.shippingAddress1 ?? "",
        Address2: eventBody.shippingAddress2 ?? "",
        Address3: eventBody.shippingAddress3 ?? "",
        Address4: eventBody.shippingAddress4 ?? "",
        City: eventBody.shippingCity ?? "",
        County: eventBody.shippingCountry ?? "",
        State: eventBody.shippingState ?? "",
        Province: eventBody.shippingProvince ?? "",
        Country: eventBody.shippingCountry ?? "",
        PostalCode: eventBody.shippingPostalCode ?? "",
      },
      MailingAddress: {
        Address1: eventBody.mailingAddress1 ?? "",
        Address2: eventBody.mailingAddress2 ?? "",
        Address3: eventBody.mailingAddress3 ?? "",
        Address4: eventBody.mailingAddress4 ?? "",
        City: eventBody.mailingCity ?? "",
        County: eventBody.mailingCountry ?? "",
        State: eventBody.mailingState ?? "",
        Province: eventBody.mailingProvince ?? "",
        Country: eventBody.mailingCountry ?? "",
        PostalCode: eventBody.mailingPostalCode ?? "",
      },
      BillingAddress: {
        Address1: eventBody.billingAddress1 ?? "",
        Address2: eventBody.billingAddress2 ?? "",
        Address3: eventBody.billingAddress3 ?? "",
        Address4: eventBody.billingAddress4 ?? "",
        City: eventBody.billingCity ?? "",
        County: eventBody.billingCountry ?? "",
        State: eventBody.billingState ?? "",
        Province: eventBody.billingProvince ?? "",
        Country: eventBody.billingCountry ?? "",
        PostalCode: eventBody.billingPostalCode ?? "",
      },
      Attributes: eventBody.additionalAttributes ?? "",
      PartyTypeString: eventBody.partyType ?? "",
      GenderString: eventBody.gender ?? "",
    };
    console.info("formattedUpdateParameters: ", formattedUpdateParameters);
  return formattedUpdateParameters;   
};

module.exports = {
  createParameterBuilder,deleteParameterBuilder, searchParameterBuilder, updateParameterBuilder
};