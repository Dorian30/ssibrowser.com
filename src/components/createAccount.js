// @TODO: Delete this eslint's disable statement once props interfaces are defined. Check this with @Tralcan
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { ayjaPstStateID, permawalletTemplateID, permawalletSourceID } from '.';
import * as DKMS from '../lib/dkms';
import * as SmartWeave from 'smartweave';

function CreateAccount({
  username,
  domain,
  address,
  pscMember,
  arweave,
  arconnect,
  keyfile
}) {
  const emptyMessage = {
    firstName: '',
    lastName: '',
    streetName: '',
    buildingNumber: '',
    country: ''
  };
  const [ivms101, setIvms101] = useState(emptyMessage);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [country, setCountry] = useState('');
  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
  };
  const handleStreetName = (event) => {
    setStreetName(event.target.value);
  };
  const handleBuildingNumber = (event) => {
    setBuildingNumber(event.target.value);
  };
  const handleCountry = (event) => {
    setCountry(event.target.value);
  };

  const [passportButton, setPassportButton] = useState('button primary');
  const [savePassport, setSavePassport] = useState(
    'Save SSI Travel Rule Passport'
  );
  const [registerButton, setRegisterButton] = useState('button primary');
  const [register, setRegister] = useState(
    'Register Self-Sovereign Identity Permawallet'
  );

  return (
    <div id="main">
      <h2 style={{ width: '100%', textAlign: 'center' }} className="major">
        {' '}
        Register {username}.{domain}{' '}
      </h2>
      <p style={{ width: '100%' }}>
        {' '}
        {username}.{domain} is available for you to register!{' '}
      </p>
      <section style={{ width: '100%' }}>
        <ol>
          <li style={{ marginTop: '4%' }}>
            <h4 className="major">Generate your SSI Travel Rule Passport</h4>
            <p>
              Create an{' '}
              <a href="https://intervasp.org/wp-content/uploads/2020/05/IVMS101-interVASP-data-model-standard-issue-1-FINAL.pdf">
                IVMS101 message
              </a>{' '}
              for KYC to make your self-hosted wallet compliant with the FATF
              Travel Rule to counteract money laundering and terrorism
              financing, and thus building a web of trust. This personal
              information will get encrypted by an SSI Travel Rule Key generated
              by your SSI Permawallet - only you decide who can read this
              message. You won&apos;t need to give this information anymore to
              third parties, over and over again. Your SSI Travel Rule - private
              - Key will get encrypted by your SSI Permaweb Key and saved into
              your wallet, so only you can access it. When making a transfer,
              you will have the option to attach this secret encrypted by the
              beneficiary&apos;s SSI Communication Key so they can read your
              Travel Rule Passport.
            </p>
            <form>
              <div className="fields">
                <div className="field half">
                  <label>First name</label>
                  <input type="text" onChange={handleFirstName} />
                </div>
                <div className="field half">
                  <label>Last name</label>
                  <input type="text" onChange={handleLastName} />
                </div>
              </div>
              <section style={{ width: '100%', marginBottom: '3%' }}>
                <h4>Residential address</h4>
                <div className="fields">
                  <input
                    type="text"
                    placeholder="Street name"
                    onChange={handleStreetName}
                  />
                </div>
              </section>
              <div className="fields">
                <div className="field half">
                  <input
                    type="text"
                    placeholder="Building number"
                    onChange={handleBuildingNumber}
                  />
                </div>
                <div className="field half">
                  <select onChange={handleCountry}>
                    <option value="">Select country of residence</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Singapore">Singapore</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
              <ul className="actions">
                <li>
                  <input
                    type="button"
                    className={passportButton}
                    value={savePassport}
                    onClick={() => {
                      setIvms101({
                        firstName: firstName,
                        lastName: lastName,
                        streetName: streetName,
                        buildingNumber: buildingNumber,
                        country: country
                      });
                      setSavePassport('Saved');
                      setPassportButton('button');
                    }}
                  />
                </li>
                <li>
                  <input
                    type="reset"
                    value="Reset"
                    onClick={() => {
                      setIvms101(emptyMessage);
                      setSavePassport('Save SSI Travel Rule Passport');
                      setPassportButton('button primary');
                    }}
                  />
                </li>
              </ul>
            </form>
          </li>
          <li style={{ marginTop: '6%' }}>
            <h4 className="major">
              Create your SSI Permawallet for {username}.{domain}
            </h4>
            <input
              type="button"
              className={registerButton}
              value={register}
              onClick={async () => {
                try {
                  if (keyfile === '' && arconnect === '') {
                    throw new Error(
                      `You have to connect with ArConnect or your keyfile.`
                    );
                  }
                  if (savePassport === 'Save SSI Travel Rule Passport') {
                    throw new Error(
                      'You have to fill up and save the SSI Travel Rule Passport information first.'
                    );
                  }
                  // SSI Communication Keys
                  const ssiCommKeys = await DKMS.generateSsiKeys(arweave);

                  // Travel Rule Passport
                  const trSsiKeys = await DKMS.generateSsiKeys(arweave);
                  const encryptedTrPassport = await DKMS.encryptData(
                    ivms101,
                    trSsiKeys.publicEncryption
                  );
                  alert(
                    `This is your encrypted SSI Travel Rule Passport: ${encryptedTrPassport}`
                  );

                  // Encrypt private keys
                  let ssiCommPrivate;
                  let ssiTravelRulePrivate;
                  if (arconnect !== '') {
                    ssiCommPrivate = await DKMS.encryptKey(
                      arconnect,
                      ssiCommKeys.privateKey
                    );
                    ssiTravelRulePrivate = await DKMS.encryptKey(
                      arconnect,
                      trSsiKeys.privateKey
                    );
                  } else {
                    const publicEncryption =
                      await DKMS.generatePublicEncryption(keyfile);
                    ssiCommPrivate = await DKMS.encryptData(
                      ssiCommKeys.privateKey,
                      publicEncryption
                    );
                    ssiTravelRulePrivate = await DKMS.encryptData(
                      trSsiKeys.privateKey,
                      publicEncryption
                    );
                  }

                  /*For testing
                                        const decryptedTrSsiKey = await DKMS.decryptData(ssiTravelRulePrivate, keyfile);
                                        alert(`SSI TR decrypted key: ${decryptedTrSsiKey}`);
                                        const decryptedTrPassport = await DKMS.decryptData(encryptedTrPassport, JSON.parse(decryptedTrSsiKey));
                                        alert(decryptedTrPassport);
                                        */

                  // Permawallet initial state

                  let permawalletInitState = await SmartWeave.readContract(
                    arweave,
                    permawalletTemplateID.toString()
                  );
                  permawalletInitState.ssi = address;
                  permawalletInitState.ssiComm = ssiCommKeys.publicEncryption;
                  permawalletInitState.trp.message = encryptedTrPassport;
                  permawalletInitState.trp.key = ssiTravelRulePrivate;
                  permawalletInitState.keys.ssiComm = ssiCommPrivate;

                  // Fee paid to the PSC

                  const fee = arweave.ar.arToWinston('0.1');
                  let tx;

                  if (arconnect !== '') {
                    if (
                      window.confirm(
                        'The fee to create your SSI Permawallet is 0.1 $AR, paid to the AYJA profit sharing community. Click OK to proceed.'
                      )
                    ) {
                      if (pscMember === address) {
                        alert(
                          `You got randomly selected as the PSC winner for this transaction - lucky you! That means no fee.`
                        );
                        tx = await arweave
                          .createTransaction({
                            data: JSON.stringify(permawalletInitState)
                          })
                          .catch((err) => {
                            throw err;
                          });
                      } else {
                        tx = await arweave.createTransaction({
                          data: JSON.stringify(permawalletInitState),
                          target: pscMember.toString(),
                          quantity: fee.toString()
                        });
                      }
                      tx.addTag('Dapp', 'tyron');
                      tx.addTag('App-Name', 'SmartWeaveContract');
                      tx.addTag('App-Version', '0.3.0');
                      tx.addTag('Contract-Src', permawalletSourceID.toString());
                      tx.addTag('Content-Type', 'application/json');

                      await arweave.transactions.sign(tx).catch((err) => {
                        throw err;
                      });
                      await arweave.transactions.post(tx).catch((err) => {
                        throw err;
                      });
                      tx = tx.id;
                    }
                  } else {
                    if (
                      window.confirm(
                        'The fee to create your SSI Permawallet is 0.1 $AR, paid to the AYJA profit sharing community. Click OK to proceed.'
                      )
                    ) {
                      if (pscMember === address) {
                        alert(
                          `You got randomly selected as the PSC winner for this transaction - lucky you! That means no fee.`
                        );
                        tx = await SmartWeave.createContractFromTx(
                          arweave,
                          keyfile,
                          permawalletSourceID.toString(),
                          JSON.stringify(permawalletInitState)
                        ).catch((err) => {
                          throw err;
                        });
                      } else {
                        tx = await SmartWeave.createContractFromTx(
                          arweave,
                          keyfile,
                          permawalletSourceID.toString(),
                          JSON.stringify(permawalletInitState),
                          [],
                          pscMember,
                          fee
                        ).catch((err) => {
                          throw err;
                        });
                      }
                    }
                  }
                  if (tx === undefined) {
                    alert(`Transaction rejected.`);
                  } else {
                    alert(`Your permawallet ID is: ${tx}`);

                    const dnsInput = {
                      function: 'dns',
                      username: username,
                      dnsssi: address,
                      dnswallet: tx
                    };

                    let dnsTx;
                    if (arconnect !== '') {
                      if (
                        window.confirm(
                          `The fee to get ${username}.${domain} is 0.1 $AR, paid to the AYJA profit sharing community. Click OK to proceed.`
                        )
                      ) {
                        if (pscMember === address) {
                          alert(
                            `You got randomly selected as the PSC winner for this transaction - lucky you! That means no fee.`
                          );
                          dnsTx = await arweave
                            .createTransaction({
                              data: Math.random().toString().slice(-4)
                            })
                            .catch((err) => {
                              throw err;
                            });
                        } else {
                          dnsTx = await arweave
                            .createTransaction({
                              data: Math.random().toString().slice(-4),
                              target: pscMember.toString(),
                              quantity: fee.toString()
                            })
                            .catch((err) => {
                              throw err;
                            });
                        }
                        dnsTx.addTag('Dapp', 'tyron');
                        dnsTx.addTag('App-Name', 'SmartWeaveAction');
                        dnsTx.addTag('App-Version', '0.3.0');
                        dnsTx.addTag('Contract', ayjaPstStateID.toString());
                        dnsTx.addTag('Input', JSON.stringify(dnsInput));

                        await arweave.transactions.sign(dnsTx).catch((err) => {
                          throw err;
                        });
                        await arweave.transactions.post(dnsTx).catch((err) => {
                          throw err;
                        });
                        dnsTx = dnsTx.id;
                      }
                    } else {
                      if (
                        window.confirm(
                          `The fee to get ${username}.${domain} is 0.1 $AR, paid to the AYJA profit sharing community. Click OK to proceed.`
                        )
                      ) {
                        if (pscMember === address) {
                          alert(
                            `You got randomly selected as the PSC winner for this transaction - lucky you! That means no fee.`
                          );
                          dnsTx = await SmartWeave.interactWrite(
                            arweave,
                            keyfile,
                            ayjaPstStateID.toString(),
                            dnsInput
                          ).catch((err) => {
                            throw err;
                          });
                        } else {
                          dnsTx = await SmartWeave.interactWrite(
                            arweave,
                            keyfile,
                            ayjaPstStateID.toString(),
                            dnsInput,
                            [],
                            pscMember.toString(),
                            fee.toString()
                          ).catch((err) => {
                            throw err;
                          });
                        }
                      }
                    }
                    if (dnsTx === undefined) {
                      alert(`Transaction rejected.`);
                    } else {
                      alert(
                        `Your DNS transaction was successful! Its ID is: ${dnsTx}`
                      );
                      setRegister('registered');
                      setRegisterButton('button');
                    }
                  }
                } catch (error) {
                  alert(error);
                }
              }}
            />
            {register === 'registered' && (
              <p style={{ marginTop: '4%' }}>
                To access {username}.{domain}&apos;s settings, go back to the
                browser, search and make sure your SSI Permaweb Key is
                connected. Please wait a few minutes until your Register
                transaction reaches finality on the Arweave network.
              </p>
            )}
          </li>
        </ol>
      </section>
    </div>
  );
}

export default CreateAccount;
