import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RootObject {
    closed:            boolean;
    creationMethod:    string;
    dateClosed:        null;
    dateLastActivity:  null;
    dateLastView:      Date | null;
    datePluginDisable: null;
    desc:              string;
    descData:          null;
    enterpriseOwned:   boolean;
    id:                string;
    idBoardSource:     null;
    idEnterprise:      null;
    idMemberCreator:   string;
    idOrganization:    string;
    idTags:            any[];
    ixUpdate:          string;
    labelNames:        LabelNames;
    limits:            Limits;
    memberships:       Membership[];
    name:              string;
    nodeId:            string;
    pinned:            boolean;
    powerUps:          any[];
    prefs:             Prefs;
    premiumFeatures:   string[];
    shortLink:         string;
    shortUrl:          string;
    starred:           boolean;
    subscribed:        boolean;
    templateGallery:   null;
    url:               string;
   }
   
   export interface LabelNames {
    black:        string;
    black_dark:   string;
    black_light:  string;
    blue:         string;
    blue_dark:    string;
    blue_light:   string;
    green:        string;
    green_dark:   string;
    green_light:  string;
    lime:         string;
    lime_dark:    string;
    lime_light:   string;
    orange:       string;
    orange_dark:  string;
    orange_light: string;
    pink:         string;
    pink_dark:    string;
    pink_light:   string;
    purple:       string;
    purple_dark:  string;
    purple_light: string;
    red:          string;
    red_dark:     string;
    red_light:    string;
    sky:          string;
    sky_dark:     string;
    sky_light:    string;
    yellow:       string;
    yellow_dark:  string;
    yellow_light: string;
   }
   
   export interface Limits {
    attachments:        Attachments;
    boards:             Boards;
    cards:              Cards;
    checkItems:         CheckItems;
    checklists:         Attachments;
    customFieldOptions: CustomFieldOptions;
    customFields:       CustomFields;
    labels:             CustomFields;
    lists:              Lists;
    reactions:          Reactions;
    stickers:           Stickers;
   }
   
   export interface Attachments {
    perBoard: PerBoard;
    perCard:  PerBoard;
   }
   
   export interface PerBoard {
    disableAt: number;
    status:    Status;
    warnAt:    number;
   }
   
   export enum Status {
    Ok = "ok",
   }
   
   export interface Boards {
    totalAccessRequestsPerBoard: PerBoard;
    totalMembersPerBoard:        PerBoard;
   }
   
   export interface Cards {
    openPerBoard:  PerBoard;
    openPerList:   PerBoard;
    totalPerBoard: PerBoard;
    totalPerList:  PerBoard;
   }
   
   export interface CheckItems {
    perChecklist: PerBoard;
   }
   
   export interface CustomFieldOptions {
    perField: PerBoard;
   }
   
   export interface CustomFields {
    perBoard: PerBoard;
   }
   
   export interface Lists {
    openPerBoard:  PerBoard;
    totalPerBoard: PerBoard;
   }
   
   export interface Reactions {
    perAction:       PerBoard;
    uniquePerAction: PerBoard;
   }
   
   export interface Stickers {
    perCard: PerBoard;
   }
   
   export interface Membership {
    deactivated: boolean;
    id:          string;
    idMember:    string;
    memberType:  string;
    unconfirmed: boolean;
   }
   
   export interface Prefs {
    background:               string;
    backgroundBottomColor:    string;
    backgroundBrightness:     string;
    backgroundColor:          string;
    backgroundImage:          null;
    backgroundImageScaled:    null;
    backgroundTile:           boolean;
    backgroundTopColor:       string;
    calendarFeedEnabled:      boolean;
    canBeEnterprise:          boolean;
    canBeOrg:                 boolean;
    canBePrivate:             boolean;
    canBePublic:              boolean;
    canInvite:                boolean;
    cardAging:                string;
    cardCovers:               boolean;
    comments:                 string;
    hiddenPluginBoardButtons: any[];
    hideVotes:                boolean;
    invitations:              string;
    isTemplate:               boolean;
    permissionLevel:          string;
    selfJoin:                 boolean;
    switcherViews:            SwitcherView[];
    voting:                   string;
   }
   
   export interface SwitcherView {
    _id:      string;
    enabled:  boolean;
    id:       string;
    typeName: TypeName;
    viewType: string;
   }
   
   export enum TypeName {
    SwitcherViews = "SwitcherViews",
   }
   

export const fetchBoards = createAsyncThunk<[], void, { rejectValue: string }>(
    "boards/fetchBoards",
    async (_, thunkAPI) => {
      try {
        const response = await fetch("https://api.trello.com/1/members/me/boards?key=8670fe9cc0999e8bf3155942da0ed34f&token=ATTA731e3636819e6a98287c2b52f082e13d2349319288709a2004fb2d571ae4f83bDB2A86E9");
        const data = await response.json();
        // const issues = data.map((issue: { title: string }) => issue.title);
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to fetch Boards.");
      }
    }
  );


export interface BoardsInitialState {
    AllBoards: RootObject[],
    loading: boolean;
    error: string | null;
}

const initialState: BoardsInitialState = {
    AllBoards: [],
    loading: false,
    error: null,
}


export const boardsSlice = createSlice({
    name: 'github_issues',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchBoards.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBoards.fulfilled, (state, action) => {
          state.loading = false;
          state.AllBoards = action.payload;
        })
        .addCase(fetchBoards.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Something went wrong';
        });
    },
});
  

export default boardsSlice.reducer;
