export interface MenuItem {
    label: string;
    link: string;
    icon?: string;
}

export const secondaryMenu: MenuItem[] = [
    {
        label:'Patreon',
        link: 'https://patreon.com/NotPublic',
        icon: "fa-solid fa-dollar-sign" ,
    },
    {
        label: "GitHub",
        link: "https://github.com/FurrySparkle/DEGA-8",
        icon: "github fab",
    },
    {
        label: "Feedback",
        link: "https://tally.so/r/wzQ66R",
        icon: "comment",
    },    
];