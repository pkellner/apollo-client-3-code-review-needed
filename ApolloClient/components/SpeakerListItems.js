import { useQuery } from '@apollo/client';
import Toolbar from '../components/Toolbar';
import { GET_LOCALSETTINGS, GET_SPEAKERS } from '../graphql/queries';
import React from 'react';
import SpeakerItem from './SpeakerItem';

const IndexPage = () => {
  const { loading, error, data: speakers } = useQuery(GET_SPEAKERS);
  // can't figure out how to destructure speakers here, arg...

  const {
    data: {
      localSettingsView: { currentTheme },
    },
  } = useQuery(GET_LOCALSETTINGS);

  if (loading) return <div className="">Loading...</div>;

  if (error === true) return <div className="col-sm6">Error</div>;

  return (
    <>
      <Toolbar />
      <div
        className={
          currentTheme === 'light'
            ? 'container show-fav'
            : 'container show-fav dark'
        }
      >
        <div className="row">
          <div className="fav-list">
            {speakers.speakers.datalist.map(
              ({ id, first, last, favorite, fullName, checkBoxColumn }) => {
                return (
                  <SpeakerItem
                    key={id}
                    speakerRec={{
                      id,
                      first,
                      last,
                      favorite,
                      fullName,
                      checkBoxColumn,
                    }}
                  ></SpeakerItem>
                );
              },
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
