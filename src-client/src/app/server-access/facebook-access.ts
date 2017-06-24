export interface FacebookClient {
    graphApiRaw<T>(url: string, errorName: string): Promise<T>;
    graphApi<T>(url: string, errorName: string): Promise<T>;
}

export interface FacebookPictureData {
    data: {
        // is_silhouette: boolean;
        url: string;
    };
}

export interface FacebookCoverPicture {
    source: string;
    // id: string;
    // offset_x: number;
    // offset_y: number;
}

export interface FacebookProfile {
    id: string;
    name: string;
    picture: FacebookPictureData;
}

const fromFields = 'from{id,name,picture}'

export interface FacebookPost {
    kind: 'FacebookPost';

    from: FacebookProfile;

    id: string;
    type: string;
    icon: string;

    created_time: string;
    createdTimeTicks: number;

    message: string;
    caption: string;
    description: string;
    link: string;

    picture: string;
    full_picture: string;
    source: string;

    permalink_url: string;
    shares: {
        count: number;
    };

    comments: {
        data: {
            id: string;
            created_time: string;
            from: FacebookProfile;
            message: string;
        }[]
    };
}

const postFields = `created_time,message,picture,full_picture,id,caption,description,type,source,link,icon,permalink_url,shares,${fromFields},comments{id,${fromFields},message,created_time}`;

// Get Posts for a single page
export async function getPosts(client: FacebookClient, accessToken: string, pageName: string, limit = 10, sinceSeconds: number = null, untilSeconds: number = null) {
    const sinceQuery = sinceSeconds && `&since=${sinceSeconds}` || '';
    const untilQuery = untilSeconds && `&until=${untilSeconds}` || '';
    const limitQuery = limit && `&limit=${limit}` || '';
    const url = `https://graph.facebook.com/v2.6/${pageName}/posts?fields=${postFields}${limitQuery}${sinceQuery}${untilQuery}&access_token=${accessToken}`;

    return client.graphApi<FacebookPost[]>(url, 'getPosts');
}

// Get posts for multiple pages in a single request
// NOTE: if any pageName is not found, the whole request will fail
export function getPosts_multiplePages(client: FacebookClient, accessToken: string, pageNames: string[], limitPerPage = 10, sinceSeconds: number = null, untilSeconds: number = null) {

    const sinceQuery = sinceSeconds && `&since=${sinceSeconds}` || '';
    const untilQuery = untilSeconds && `&until=${untilSeconds}` || '';
    const limitQuery = limitPerPage && `&limit=${limitPerPage}` || '';
    const url = `https://graph.facebook.com/v2.6/posts?ids=${pageNames.join(',')}&fields=${postFields}${limitQuery}${sinceQuery}${untilQuery}&access_token=${accessToken}`;

    type returnType = {
        [pageName: string]: {
            data: FacebookPost[];
            paging: {
                cursors: {
                    before: string;
                    after: string;
                },
                // Request Url for next n=limit items of this pageName
                next: string
            }
        }
    };

    return client.graphApiRaw<returnType>(url, 'getPosts_multiplePages');
}

