import React, { useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { GET_LOCALSETTINGS, GET_SPEAKERS } from '../graphql/queries';
import { ADD_SPEAKERS, TOGGLE_SPEAKER_FAVORITE } from '../graphql/mutations';

import { checkBoxListVar, localSettingsVar } from '../graphql/cache';

const Toolbar = () => {
  const apolloClient = useApolloClient();
  const [addSpeaker] = useMutation(ADD_SPEAKERS);
  const [toggleSpeakerFavorite] = useMutation(TOGGLE_SPEAKER_FAVORITE);

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [favorite, setFavorite] = useState(false);

  const sortByIdDescending = () => {
    const { speakers } = apolloClient.cache.readQuery({
      query: GET_SPEAKERS,
    });
    apolloClient.cache.writeQuery({
      query: GET_SPEAKERS,
      data: {
        speakers: {
          __typename: 'SpeakerResults',
          datalist: [...speakers.datalist].sort((a, b) => b.id - a.id),
        },
      },
    });
  };

  const insertSpeakerEvent = (first, last, favorite) => {
    addSpeaker({
      variables: {
        first,
        last,
        favorite,
      },
      update: (cache, { data: { addSpeaker } }) => {
        const { speakers } = cache.readQuery({
          query: GET_SPEAKERS,
        });
        cache.writeQuery({
          query: GET_SPEAKERS,
          data: {
            speakers: {
              __typename: 'SpeakerResults',
              datalist: [addSpeaker, ...speakers.datalist],
            },
          },
        });
      },
    });
  };

  const toggleAllChecked = () => {
    const { selectedSpeakerIds } = checkBoxListVar();
    if (selectedSpeakerIds) {
      selectedSpeakerIds.forEach((speakerId) => {
        toggleSpeakerFavorite({
          variables: {
            speakerId: parseInt(speakerId),
          },
        });
      });
      //checkBoxListVar({ selectedSpeakerIds: [] });
    }
  };

  const batchCheck = (checkAll) => {
    let newSpeakerIds = [];
    if (checkAll === true) {
      const data = apolloClient.cache.readQuery({
        query: GET_SPEAKERS,
      });
      newSpeakerIds = data?.speakers?.datalist.map((rec) => {
        return rec.id;
      });
    }
    checkBoxListVar({ selectedSpeakerIds: newSpeakerIds });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    insertSpeakerEvent(first, last, favorite);
    setFirst('');
    setLast('');
    setFavorite(false);
    setModal(!modal);
  };

  // const {
  //   data: {
  //     localSettingsView: { currentTheme },
  //   },
  // } = useQuery(
  //     GET_LOCALSETTINGS
  // );

  const {
    data: { localSettingsView: localSettings },
  } = useQuery(GET_LOCALSETTINGS);

  return (
    <section className="toolbar">
      <div className="container">
        <ul className="toolrow">
          {localSettings.enableTheming ? (
            <li>
              <strong>Theme</strong>{' '}
              <label className="dropmenu">
                <select
                  className="form-control theme"
                  value={localSettings.currentTheme}
                  onChange={({ currentTarget }) => {
                    localSettingsVar({
                      ...localSettings,
                      currentTheme: currentTarget.value,
                    });
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </li>
          ) : (
            <></>
          )}

          <li>
            <div>
              <Button onClick={toggleAllChecked} color="info">
                <span>Toggle All Checked</span>
              </Button>{' '}
              &nbsp;
              <Button
                onClick={() => {
                  batchCheck(true);
                }}
                color="info"
              >
                <span>Check All</span>
              </Button>
              &nbsp;
              <Button
                onClick={() => {
                  batchCheck(false);
                }}
                color="info"
              >
                <span>Check None</span>
              </Button>
              &nbsp;
              <Button color="info" onClick={toggle}>
                <span>Insert Speaker</span>
              </Button>
              &nbsp;
              <Button onClick={sortByIdDescending} color="info">
                <span>Sort By Id Desc</span>
              </Button>
              &nbsp;
              <Modal isOpen={modal} toggle={toggle}>
                <Form onSubmit={handleSubmit}>
                  <ModalHeader toggle={toggle}>
                    Insert Speaker Dialog
                  </ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label for="first">First Name</Label>{' '}
                      <Input
                        name="first"
                        onChange={(e) => setFirst(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="first">Last Name</Label>{' '}
                      <Input
                        name="first"
                        onChange={(e) => setLast(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          onChange={(e) => setFavorite(e.target.value === 'on')}
                        />{' '}
                        Favorite
                      </Label>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit">Save</Button>
                  </ModalFooter>
                </Form>
              </Modal>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Toolbar;
