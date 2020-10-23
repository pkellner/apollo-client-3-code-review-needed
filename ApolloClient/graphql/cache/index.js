import { InMemoryCache } from '@apollo/client';
import { GET_CHECKBOXLIST_ARRAY } from '../queries';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        checkBoxListView: {
          read(_, { cache, readField }) {
            return checkBoxListVar();

            // const {
            //   checkBoxListArray: { currentCheckBoxListArray },
            // } = cache.readQuery({ query: GET_CHECKBOXLIST_ARRAY });
            //
            // // const data = index.readQuery({query: GET_CHECKBOXLIST_ARRAY});
            // // const currentCheckBoxListArray = data.checkBoxListArray.currentCheckBoxListArray;
            // return currentCheckBoxListArray &&
            // currentCheckBoxListArray.length > 0
            //     ? currentCheckBoxListArray.includes(readField("id"))
            //     : false;
          },
        },

        // theme: {
        //   read() {
        //     const currentTheme = themeVar();
        //     return { currentTheme };
        //   },
        // },
        localSettingsView: {
          read() {
            const localSettingsView = localSettingsVar();
            return localSettingsView;
          },
        },
      },
    },
    Speaker: {
      fields: {
        checkBoxColumn: {
          read(_, { cache, readField }) {
            var id = readField('id');
            const {
              checkBoxListView: { selectedSpeakerIds },
            } = cache.readQuery({ query: GET_CHECKBOXLIST_ARRAY });

            return selectedSpeakerIds ? selectedSpeakerIds.includes(id) : false;
          },
        },
        first: {
          read(first = 'unknown', { cache }) {
            return first && first.length > 0 ? first : '...unknown...';
          },
        },
        last: {
          read(last = 'unknown') {
            return last && last.length > 0
              ? last.length > 10
                ? last.slice(0, 10)
                : last
              : '...unknown...';
          },
        },
        fullName: {
          read(_, { readField }) {
            return `${readField('first')}  ${readField('last')}`;
          },
        },
      },
    },
  },
});

export { cache };

const localSettings = {
  enableTheming: true,
  currentTheme: 'light',
};

export const localSettingsVar = cache.makeVar(localSettings);

export const checkBoxListVar = cache.makeVar({
  selectedSpeakerIds: [],
});

// const getCache = () => {
//   return new InMemoryCache();
// };

// export const cache = {
//   typePolicies: {
//     Speaker: {
//       fields: {
//         checkListBox: {
//           read(checkListBox = true, { cache, readField }) {
//             const {
//               checkBoxListArray: { currentCheckBoxListArray },
//             } = cache.readQuery({ query: GET_CHECKBOXLIST_ARRAY });
//
//             // const data = index.readQuery({query: GET_CHECKBOXLIST_ARRAY});
//             // const currentCheckBoxListArray = data.checkBoxListArray.currentCheckBoxListArray;
//             return currentCheckBoxListArray &&
//               currentCheckBoxListArray.length > 0
//               ? currentCheckBoxListArray.includes(readField("id"))
//               : false;
//           },
//         },
//         first: {
//           read(first = "UNKNOWN FIRST") {
//             return first; // always runs before index read
//           },
//         },
//         fullName: {
//           read(fullName = "UNKNOWN FULLNAME", { readField }) {
//             return `${readField("first")} ${readField("last")}`;
//           },
//         },
//       },
//     },
//     Query: {
//       fields: {
//         theme: {
//           read() {
//             const currentTheme = themeVar();
//             return { currentTheme };
//           },
//         },
//         checkBoxListArray: {
//           read() {
//             const currentCheckBoxListArray = checkBoxListArrayVar();
//             return { currentCheckBoxListArray };
//           },
//         },
//       },
//     },
//   },
// };
