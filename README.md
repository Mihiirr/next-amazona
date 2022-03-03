This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Deployment

After having run the `create-remix` command and selected "Vercel" as a
deployment target, you only need to
[import your Git repository](https://vercel.com/new) into Vercel, and it will be
deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory
by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will
then automatically be deployed by Vercel, through its
[Git Integration](https://vercel.com/docs/concepts/git).

# Install yarn

`Step:1` We are using yarn package manager so install yarn using. if you're using
it already then skip this step:

```sh
- npm install -g yarn
```

`Step:2` Install all dependencies:
 
 ```sh
- yarn install
```

# Install PlanetScale CLI - Windows

`Step:3` Make sure PowerShell 5 (or later, include PowerShell Core) and .NET
Framework 4.5 (or later) are installed. Then run:

```sh
- Invoke-Expression (New-ObjectSystem.Net.WebClient).DownloadString('https://get.scoop.sh')
```
Note: if you get an error you might need to change the execution policy (i.e.
enable Powershell) with below code and run again step:1

```sh
- Set-ExecutionPolicy RemoteSigned -scope CurrentUser
```

`Step:4` Scoop installs the tools you know and love:

```sh
- scoop install curl
```

`Step:5`

```sh
- scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
```

`Step:6` Install pscale:

```sh
- scoop install pscale
```

To upgrade to the latest version:

```sh
- scoop update pscale
```

`Step:7` Verify that you're using the latest version:

```sh
- pscale version
```

# Connect database

`Step:8` Generate prisma client:

```sh
- yarn prisma:generate
```

If this throws error run:

```sh
- npx prisma generate
```

`Step:9` Connect database using:

```sh
- yarn connect:database:develop
```

# Run locally

```sh
- yarn dev
```