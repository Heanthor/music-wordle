function Footer() {
    return (
        <div>
            <footer className=" dark:bg-neutral-600 bg-[#FBFBFB] min-w-full text-neutral-200 py-1 px-4 border-t-2 border-neutral-500 flex justify-between absolute bottom-0">
                <span>Made with 🎻 by <a className="underline decoration-dashed underline-offset-4" href="https://github.com/Heanthor">@Heanthor</a></span>
                <span>© {new Date().getFullYear()}</span>
            </footer>
        </div>

    )
}

export default Footer;
