import { gql } from '@apollo/client';

export const GET_CHECKBOXLIST_ARRAY = gql`
  query {
    checkBoxListView @client {
      selectedSpeakerIds
    }
  }
`;

export const GET_LOCALSETTINGS = gql`
  query {
    localSettingsView @client {
      enableTheming
      currentTheme
    }
  }
`;

export const GET_SPEAKERS = gql`
  query {
    speakers {
      datalist {
        id
        first
        last
        favorite
        fullName @client
        checkBoxColumn @client
      }
    }
  }
`;
