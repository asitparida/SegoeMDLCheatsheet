# SegoeMDLCheatsheet
Web crawled SCSS sheet for Segoe MDL Icons from the site <a href="http://modernicons.io/segoe-mdl2/cheatsheet/">http://modernicons.io/segoe-mdl2/cheatsheet/</a>


SCSS File Sample

    .icon {
        font-family: "SegoeMDL";
        font-weight: normal;
        font-style: normal;
        position: relative;
        top: 1px;
        display: inline-block;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    
        &.icon-accept:before { /* KEYWORDS - Check */
            content: "\E8FB";
        }
    
        &.icon-accounts:before { /* KEYWORDS - at email */
            content: "\E910";
        }
    }
