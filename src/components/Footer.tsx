function Footer() {
    return (
        <div className=" dark:bg-neutral-600 bg-[#FBFBFB] container mx-auto text-neutral-200 mt-4 py-1 px-4 border-t-2 border-neutral-500 flex justify-between">
            <span>Made with 🎻 by <a className="underline decoration-dashed underline-offset-4" href="https://github.com/Heanthor">@Heanthor</a></span>
            <span>© {new Date().getFullYear()}</span>
        </div>
    )
}

export default Footer;
