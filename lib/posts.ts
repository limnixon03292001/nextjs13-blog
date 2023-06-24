import { compileMDX } from 'next-mdx-remote/rsc'
import Video from '@/app/components/Video'
import CustomImage from '@/app/components/CustomImage'


type Filetree = {
    "tree": [
        {
            "path": string
        }
    ]
}


export async function getPostByName(fileName: string): Promise<BlogPost | undefined> {

    const res = await fetch(`https://raw.githubusercontent.com/limnixon03292001/blogposts-api/main/${fileName}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28',
        }
    })

    if(!res.ok) return undefined

    const rawMdx = await res.text()

    if(rawMdx === '404: Not Found') return undefined

    // Optionally provide a type for your frontmatter object
    const { frontmatter, content } = await compileMDX<{ title: string, date: string, tags: string[] }>({
        source: rawMdx,
        components: {
            Video,
            CustomImage
        },
        options: { 
            parseFrontmatter: true
         }
    })

    const id = fileName.replace(/\.mdx$/, '')

    const blogPostObj: BlogPost = { meta: { id, title: frontmatter.title, date: frontmatter.date, tags: frontmatter.tags }, content}

    return blogPostObj

}

export async function getPostsMeta(): Promise<Meta[] | undefined> {
    const res = await fetch('https://api.github.com/repos/limnixon03292001/blogposts-api/git/trees/main?recursive=1', {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28',
        }
    })

    if(!res.ok) return undefined

    const repoFiletree: Filetree = await res.json()

    const filesArray = repoFiletree.tree.map(obj => obj.path).filter(path => path.endsWith('.mdx'))

    const posts: Meta[]  = []

    for(const file of filesArray) {
        const post = await getPostByName(file)
        if(post) {
            const { meta } = post
            posts.push(meta)
        }
    }

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}